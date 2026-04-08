<?php

namespace App\Support;

use App\Models\AdminAuditLog;
use App\Models\PageActivity;
use App\Models\Project;
use App\Models\ReservedSubDomain;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class AdminDashboardService
{
    private ?Collection $healthProjects = null;

    /**
     * @return array<string, int|float>
     */
    public function overview(): array
    {
        $weekStart = now()->subDays(6)->startOfDay();
        $todayStart = now()->startOfDay();

        $usersTotal = User::query()->count();
        $usersNew7d = User::query()->where('created_at', '>=', $weekStart)->count();

        $projectsTotal = Project::query()->count();
        $projectsNew7d = Project::query()->where('created_at', '>=', $weekStart)->count();

        $publishedTotal = Project::query()->where('published', true)->count();
        $draftTotal = max($projectsTotal - $publishedTotal, 0);

        $views7d = PageActivity::query()
            ->where('type', 'view')
            ->where('created_at', '>=', $weekStart)
            ->count();

        $clicks7d = PageActivity::query()
            ->where('type', 'click')
            ->where('created_at', '>=', $weekStart)
            ->count();

        $viewsToday = PageActivity::query()
            ->where('type', 'view')
            ->where('created_at', '>=', $todayStart)
            ->count();

        $clicksToday = PageActivity::query()
            ->where('type', 'click')
            ->where('created_at', '>=', $todayStart)
            ->count();

        $missingSubdomain = Project::query()
            ->where(function ($query): void {
                $query->whereNull('sub_domain')
                    ->orWhere('sub_domain', '');
            })
            ->count();

        return [
            'users_total' => $usersTotal,
            'users_new_7d' => $usersNew7d,
            'projects_total' => $projectsTotal,
            'projects_new_7d' => $projectsNew7d,
            'published_total' => $publishedTotal,
            'draft_total' => $draftTotal,
            'views_7d' => $views7d,
            'views_today' => $viewsToday,
            'clicks_7d' => $clicks7d,
            'clicks_today' => $clicksToday,
            'ctr_7d' => $views7d > 0 ? round(($clicks7d / $views7d) * 100, 1) : 0.0,
            'needs_attention_total' => $this->needsAttentionProjects()->count(),
            'missing_subdomain_total' => $missingSubdomain,
            'reserved_subdomains_total' => ReservedSubDomain::query()->count(),
            'audit_events_7d' => AdminAuditLog::query()->where('created_at', '>=', $weekStart)->count(),
        ];
    }

    /**
     * @return array{labels: array<int, string>, views: array<int, int>, clicks: array<int, int>}
     */
    public function trafficTrend(int $days = 14): array
    {
        $start = CarbonImmutable::now()->subDays($days - 1)->startOfDay();
        $rows = PageActivity::query()
            ->selectRaw('DATE(created_at) as activity_date, type, COUNT(*) as total')
            ->whereIn('type', ['view', 'click'])
            ->where('created_at', '>=', $start)
            ->groupBy('activity_date', 'type')
            ->orderBy('activity_date')
            ->get();

        $grouped = $rows
            ->groupBy('activity_date')
            ->map(fn (Collection $items): array => $items->pluck('total', 'type')->all());

        $labels = [];
        $views = [];
        $clicks = [];

        for ($cursor = $start; $cursor->lte(CarbonImmutable::now()->startOfDay()); $cursor = $cursor->addDay()) {
            $key = $cursor->toDateString();
            $labels[] = $cursor->format('M j');
            $views[] = (int) ($grouped[$key]['view'] ?? 0);
            $clicks[] = (int) ($grouped[$key]['click'] ?? 0);
        }

        return compact('labels', 'views', 'clicks');
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function projectStatusBuckets(): array
    {
        $overview = $this->overview();

        return [
            'labels' => ['Published', 'Draft', 'Needs attention', 'Missing subdomain'],
            'data' => [
                (int) $overview['published_total'],
                (int) $overview['draft_total'],
                (int) $overview['needs_attention_total'],
                (int) $overview['missing_subdomain_total'],
            ],
        ];
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function projectTypeDistribution(): array
    {
        $rows = Project::query()
            ->selectRaw('type, COUNT(*) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $labels = [
            'portfolio' => 'Portfolio',
            'linktree' => 'Link page',
            'menu' => 'Menu',
            'biz' => 'Business',
            'waitlist' => 'Waitlist',
        ];

        return [
            'labels' => array_values($labels),
            'data' => array_map(fn (string $type): int => (int) ($rows[$type] ?? 0), array_keys($labels)),
        ];
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function contentHealthBreakdown(): array
    {
        $complete = 0;
        $needsContent = 0;
        $missingSubdomain = 0;

        foreach ($this->healthProjects() as $project) {
            if (blank($project->sub_domain)) {
                $missingSubdomain++;
            }

            if (empty(ProjectContentInspector::issues($project))) {
                $complete++;
            } else {
                $needsContent++;
            }
        }

        return [
            'labels' => ['Complete', 'Needs content', 'Missing subdomain'],
            'data' => [$complete, $needsContent, $missingSubdomain],
        ];
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function userGrowthTrend(int $days = 14): array
    {
        $start = CarbonImmutable::now()->subDays($days - 1)->startOfDay();
        $rows = User::query()
            ->selectRaw('DATE(created_at) as created_date, COUNT(*) as total')
            ->where('created_at', '>=', $start)
            ->groupBy('created_date')
            ->orderBy('created_date')
            ->pluck('total', 'created_date');

        $labels = [];
        $data = [];

        for ($cursor = $start; $cursor->lte(CarbonImmutable::now()->startOfDay()); $cursor = $cursor->addDay()) {
            $key = $cursor->toDateString();
            $labels[] = $cursor->format('M j');
            $data[] = (int) ($rows[$key] ?? 0);
        }

        return compact('labels', 'data');
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function adminActivityTrend(int $days = 14): array
    {
        $start = CarbonImmutable::now()->subDays($days - 1)->startOfDay();
        $rows = AdminAuditLog::query()
            ->selectRaw('DATE(created_at) as created_date, COUNT(*) as total')
            ->where('created_at', '>=', $start)
            ->groupBy('created_date')
            ->orderBy('created_date')
            ->pluck('total', 'created_date');

        $labels = [];
        $data = [];

        for ($cursor = $start; $cursor->lte(CarbonImmutable::now()->startOfDay()); $cursor = $cursor->addDay()) {
            $key = $cursor->toDateString();
            $labels[] = $cursor->format('M j');
            $data[] = (int) ($rows[$key] ?? 0);
        }

        return compact('labels', 'data');
    }

    /**
     * @return array{labels: array<int, string>, views: array<int, int>, clicks: array<int, int>}
     */
    public function topProjectsChartData(int $limit = 6): array
    {
        $projects = Project::query()
            ->withCount([
                'pageActivities as views_count' => fn ($query) => $query->where('type', 'view'),
                'pageActivities as clicks_count' => fn ($query) => $query->where('type', 'click'),
            ])
            ->orderByDesc('views_count')
            ->orderByDesc('clicks_count')
            ->limit($limit)
            ->get();

        return [
            'labels' => $projects->map(fn (Project $project): string => str($project->name)->limit(18)->toString())->all(),
            'views' => $projects->pluck('views_count')->map(fn ($value): int => (int) $value)->all(),
            'clicks' => $projects->pluck('clicks_count')->map(fn ($value): int => (int) $value)->all(),
        ];
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function attentionByType(): array
    {
        $counts = [
            'Portfolio' => 0,
            'Link page' => 0,
            'Menu' => 0,
            'Business' => 0,
            'Waitlist' => 0,
        ];

        foreach ($this->needsAttentionProjects() as $project) {
            $label = match ($project->type) {
                'portfolio' => 'Portfolio',
                'linktree' => 'Link page',
                'menu' => 'Menu',
                'biz' => 'Business',
                default => 'Waitlist',
            };

            $counts[$label]++;
        }

        return [
            'labels' => array_keys($counts),
            'data' => array_values($counts),
        ];
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function adminActionBreakdown(int $limit = 6): array
    {
        $rows = AdminAuditLog::query()
            ->selectRaw('action, COUNT(*) as total')
            ->groupBy('action')
            ->orderByDesc('total')
            ->limit($limit)
            ->pluck('total', 'action');

        return [
            'labels' => $rows->keys()->map(fn ($action): string => str((string) $action)->replace('.', ' ')->title()->toString())->all(),
            'data' => $rows->values()->map(fn ($value): int => (int) $value)->all(),
        ];
    }

    /**
     * @return array<int, int>
     */
    public function topProjectIds(int $limit = 8): array
    {
        return Project::query()
            ->withCount([
                'pageActivities as views_count' => fn ($query) => $query->where('type', 'view'),
                'pageActivities as clicks_count' => fn ($query) => $query->where('type', 'click'),
            ])
            ->orderByDesc('views_count')
            ->orderByDesc('clicks_count')
            ->limit($limit)
            ->pluck('id')
            ->all();
    }

    /**
     * @return array<int, int>
     */
    public function needsAttentionProjectIds(int $limit = 8): array
    {
        return $this->needsAttentionProjects()
            ->take($limit)
            ->pluck('id')
            ->all();
    }

    private function needsAttentionProjects(): Collection
    {
        return $this->healthProjects()
            ->map(function (Project $project): Project {
                $issues = ProjectContentInspector::issues($project);
                $attentionScore = count($issues);

                if (! $project->published) {
                    $attentionScore += 1;
                }

                if (blank($project->sub_domain)) {
                    $attentionScore += 1;
                }

                $project->setAttribute('dashboard_attention_score', $attentionScore);

                return $project;
            })
            ->filter(fn (Project $project): bool => (int) $project->getAttribute('dashboard_attention_score') > 0)
            ->sortByDesc(function (Project $project): array {
                return [
                    (int) $project->getAttribute('dashboard_attention_score'),
                    optional($project->updated_at)?->timestamp ?? 0,
                ];
            })
            ->values();
    }

    private function healthProjects(): Collection
    {
        if ($this->healthProjects !== null) {
            return $this->healthProjects;
        }

        return $this->healthProjects = Project::query()
            ->with([
                'user',
                'portfolio.workExperiences',
                'portfolio.showcases',
                'portfolio.skills',
                'linktree.sections',
                'linktree.links',
                'menu.categories',
                'menu.items',
            ])
            ->latest('updated_at')
            ->get();
    }
}
