<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class ContentHealthChart extends BaseChartWidget
{
    protected static ?int $sort = 50;

    protected ?string $heading = 'Content health';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $breakdown = app(AdminDashboardService::class)->contentHealthBreakdown();

        return [
            'labels' => $breakdown['labels'],
            'datasets' => [
                [
                    'label' => 'Projects',
                    'data' => $breakdown['data'],
                    'backgroundColor' => [
                        '#22c55e',
                        '#f59e0b',
                        '#ef4444',
                    ],
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
