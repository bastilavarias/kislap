<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class DashboardOperationsSection extends Widget
{
    protected string $view = 'filament.widgets.dashboard-operations-section';

    protected int|string|array $columnSpan = 'full';
}
