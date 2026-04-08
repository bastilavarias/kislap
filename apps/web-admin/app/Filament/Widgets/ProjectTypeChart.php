<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class ProjectTypeChart extends BaseChartWidget
{
    protected static ?int $sort = 40;

    protected ?string $heading = 'Project mix';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $distribution = app(AdminDashboardService::class)->projectTypeDistribution();

        return [
            'labels' => $distribution['labels'],
            'datasets' => [
                [
                    'label' => 'Projects',
                    'data' => $distribution['data'],
                    'backgroundColor' => [
                        '#111827',
                        '#f59e0b',
                        '#2563eb',
                        '#22c55e',
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
