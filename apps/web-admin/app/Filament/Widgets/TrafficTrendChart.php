<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class TrafficTrendChart extends BaseChartWidget
{
    protected static ?int $sort = 10;

    protected ?string $heading = 'Traffic in the last 14 days';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $trend = app(AdminDashboardService::class)->trafficTrend();

        return [
            'labels' => $trend['labels'],
            'datasets' => [
                [
                    'label' => 'Views',
                    'data' => $trend['views'],
                    'borderColor' => '#f59e0b',
                    'backgroundColor' => 'rgba(245, 158, 11, 0.12)',
                    'tension' => 0.3,
                ],
                [
                    'label' => 'Clicks',
                    'data' => $trend['clicks'],
                    'borderColor' => '#111827',
                    'backgroundColor' => 'rgba(17, 24, 39, 0.08)',
                    'tension' => 0.3,
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
