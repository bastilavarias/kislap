<?php

namespace App\Filament\Widgets;

use App\Models\HelpInquiry;
use App\Support\AdminDashboardService;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminStatsOverview extends StatsOverviewWidget
{
    protected static bool $isLazy = false;
    protected static ?int $sort = 0;

    protected function getStats(): array
    {
        $overview = app(AdminDashboardService::class)->overview();
        $openSupportTickets = HelpInquiry::query()
            ->whereIn('status', ['new', 'in_progress'])
            ->count();

        $newSupportTickets = HelpInquiry::query()
            ->where('status', 'new')
            ->count();

        return [
            Stat::make('Users', number_format((int) $overview['users_total']))
                ->description('+' . number_format((int) $overview['users_new_7d']) . ' in the last 7 days'),
            Stat::make('Published', number_format((int) $overview['published_total']))
                ->description(number_format((int) $overview['draft_total']) . ' still in draft'),
            Stat::make('Views (7d)', number_format((int) $overview['views_7d']))
                ->description(number_format((int) $overview['views_today']) . ' today'),
            Stat::make('CTR (7d)', number_format((float) $overview['ctr_7d'], 1) . '%')
                ->description('Clicks vs views in the last 7 days'),
            Stat::make('Needs attention', number_format((int) $overview['needs_attention_total']))
                ->description(number_format((int) $overview['missing_subdomain_total']) . ' missing a subdomain'),
            Stat::make('Support tickets', number_format($openSupportTickets))
                ->description(number_format($newSupportTickets) . ' new right now'),
        ];
    }
}
