<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class AdminActionBreakdownChart extends BaseChartWidget
{
    protected static ?int $sort = 910;

    protected ?string $heading = 'Top admin actions';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $breakdown = app(AdminDashboardService::class)->adminActionBreakdown();

        return [
            'labels' => $breakdown['labels'],
            'datasets' => [
                [
                    'label' => 'Events',
                    'data' => $breakdown['data'],
                    'backgroundColor' => [
                        '#ef4444',
                        '#f59e0b',
                        '#2563eb',
                        '#22c55e',
                        '#111827',
                        '#a855f7',
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
