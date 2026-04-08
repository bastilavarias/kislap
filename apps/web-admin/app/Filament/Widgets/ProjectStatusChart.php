<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class ProjectStatusChart extends BaseChartWidget
{
    protected static ?int $sort = 30;

    protected ?string $heading = 'Publishing and attention snapshot';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $snapshot = app(AdminDashboardService::class)->projectStatusBuckets();

        return [
            'labels' => $snapshot['labels'],
            'datasets' => [
                [
                    'label' => 'Projects',
                    'data' => $snapshot['data'],
                    'backgroundColor' => [
                        '#111827',
                        '#f59e0b',
                        '#ef4444',
                        '#9ca3af',
                    ],
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
