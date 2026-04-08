<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class DashboardOverviewSection extends Widget
{
    protected string $view = 'filament.widgets.dashboard-overview-section';

    protected int|string|array $columnSpan = 'full';
}
