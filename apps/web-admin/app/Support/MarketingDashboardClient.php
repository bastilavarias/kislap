<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class MarketingDashboardClient
{
    /**
     * @return array<string, mixed>
     */
    public function overview(int $days = 14): array
    {
        return Cache::remember(
            "marketing-dashboard-overview:{$days}",
            now()->addSeconds(30),
            function () use ($days): array {
                $baseUrl = rtrim((string) config('services.api_service.base_url', 'http://localhost:5000'), '/');

                try {
                    $response = Http::timeout(5)
                        ->acceptJson()
                        ->get("{$baseUrl}/api/marketing-analytics/overview", [
                            'days' => $days,
                        ]);

                    if (! $response->successful()) {
                        return $this->emptyOverview();
                    }

                    $payload = $response->json();

                    return is_array($payload['data'] ?? null) ? $payload['data'] : $this->emptyOverview();
                } catch (Throwable) {
                    return $this->emptyOverview();
                }
            },
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function emptyOverview(): array
    {
        return [
            'totals' => [
                'total_sessions' => 0,
                'unique_visitors' => 0,
                'total_page_views' => 0,
                'total_clicks' => 0,
                'average_duration_seconds' => 0,
                'bounce_rate' => 0,
            ],
            'trend' => [
                'labels' => [],
                'sessions' => [],
                'page_views' => [],
                'clicks' => [],
            ],
            'top_pages' => [],
            'event_breakdown' => [],
            'source_breakdown' => [],
        ];
    }
}
