<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class DashboardInsightsSection extends Widget
{
    protected string $view = 'filament.widgets.dashboard-insights-section';

    protected int|string|array $columnSpan = 'full';
}
