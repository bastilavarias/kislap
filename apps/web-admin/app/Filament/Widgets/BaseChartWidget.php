<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

abstract class BaseChartWidget extends ChartWidget
{
    protected static bool $isLazy = false;
}
