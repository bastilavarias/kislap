<?php

namespace App\Filament\Widgets;

use App\Models\Linktree;
use App\Models\Menu;
use App\Models\Portfolio;
use App\Models\Project;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminStatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Users', User::query()->count())
                ->description('Total accounts'),
            Stat::make('Projects', Project::query()->count())
                ->description('All project types'),
            Stat::make('Published', Project::query()->where('published', true)->count())
                ->description('Live projects'),
            Stat::make('Portfolios', Portfolio::query()->count()),
            Stat::make('Link pages', Linktree::query()->count()),
            Stat::make('Menus', Menu::query()->count()),
        ];
    }
}
