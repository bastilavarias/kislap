<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class TopProjectsChart extends BaseChartWidget
{
    protected static ?int $sort = 110;

    protected ?string $heading = 'Top projects by traffic';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '300px';

    protected function getData(): array
    {
        $data = app(AdminDashboardService::class)->topProjectsChartData();

        return [
            'labels' => $data['labels'],
            'datasets' => [
                [
                    'label' => 'Views',
                    'data' => $data['views'],
                    'backgroundColor' => '#111827',
                ],
                [
                    'label' => 'Clicks',
                    'data' => $data['clicks'],
                    'backgroundColor' => '#f59e0b',
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
