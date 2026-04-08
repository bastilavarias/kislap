<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use App\Filament\Widgets\AdminActionBreakdownChart;
use App\Filament\Widgets\AdminActivityChart;
use App\Filament\Widgets\AdminStatsOverview;
use App\Filament\Widgets\AttentionByTypeChart;
use App\Filament\Widgets\ContentHealthChart;
use App\Filament\Widgets\MarketingEventsChart;
use App\Filament\Widgets\MarketingSourceChart;
use App\Filament\Widgets\MarketingTopPagesChart;
use App\Filament\Widgets\MarketingTrafficChart;
use App\Filament\Widgets\ProjectTypeChart;
use App\Filament\Widgets\ProjectStatusChart;
use App\Filament\Widgets\TopProjectsChart;
use App\Filament\Widgets\TrafficTrendChart;
use App\Filament\Widgets\UserGrowthChart;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->brandName('Kislap Admin')
            ->login()
            ->colors([
                'primary' => Color::Amber,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->widgets([
                AdminStatsOverview::class,
                TrafficTrendChart::class,
                UserGrowthChart::class,
                ProjectStatusChart::class,
                ProjectTypeChart::class,
                ContentHealthChart::class,
                AttentionByTypeChart::class,
                MarketingTrafficChart::class,
                MarketingTopPagesChart::class,
                MarketingSourceChart::class,
                MarketingEventsChart::class,
                TopProjectsChart::class,
                AdminActivityChart::class,
                AdminActionBreakdownChart::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
