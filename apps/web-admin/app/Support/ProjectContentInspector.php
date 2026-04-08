<?php

namespace App\Support;

use App\Models\Project;

class ProjectContentInspector
{
    /**
     * @return array<int, string>
     */
    public static function issues(Project $project): array
    {
        return match ($project->type) {
            'portfolio' => self::portfolioIssues($project),
            'linktree' => self::linktreeIssues($project),
            'menu' => self::menuIssues($project),
            default => [],
        };
    }

    /**
     * @return array<int, string>
     */
    private static function portfolioIssues(Project $project): array
    {
        $issues = [];
        $portfolio = $project->portfolio;

        if (! $portfolio) {
            return ['Missing portfolio record'];
        }

        if (! $portfolio->name) {
            $issues[] = 'Missing name';
        }

        if (! $portfolio->job_title) {
            $issues[] = 'Missing job title';
        }

        if (! $portfolio->avatar_url) {
            $issues[] = 'Missing avatar';
        }

        if (! $portfolio->workExperiences()->exists()) {
            $issues[] = 'No work experience';
        }

        if (! $portfolio->showcases()->exists()) {
            $issues[] = 'No showcase projects';
        }

        if (! $portfolio->skills()->exists()) {
            $issues[] = 'No skills';
        }

        return $issues;
    }

    /**
     * @return array<int, string>
     */
    private static function linktreeIssues(Project $project): array
    {
        $issues = [];
        $linktree = $project->linktree;

        if (! $linktree) {
            return ['Missing link page record'];
        }

        if (! $linktree->name) {
            $issues[] = 'Missing name';
        }

        if (! $linktree->logo_url) {
            $issues[] = 'Missing logo';
        }

        $hasSections = $linktree->sections()->exists();
        $hasLinks = $linktree->links()->exists();

        if (! $hasSections && ! $hasLinks) {
            $issues[] = 'No links or sections';
        }

        return $issues;
    }

    /**
     * @return array<int, string>
     */
    private static function menuIssues(Project $project): array
    {
        $issues = [];
        $menu = $project->menu;

        if (! $menu) {
            return ['Missing menu record'];
        }

        if (! $menu->name) {
            $issues[] = 'Missing name';
        }

        if (! $menu->cover_image_url) {
            $issues[] = 'Missing cover image';
        }

        if (! $menu->categories()->exists()) {
            $issues[] = 'No categories';
        }

        if (! $menu->items()->exists()) {
            $issues[] = 'No menu items';
        }

        return $issues;
    }
}
