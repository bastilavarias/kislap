<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class UserGrowthChart extends BaseChartWidget
{
    protected static ?int $sort = 20;

    protected ?string $heading = 'New users in the last 14 days';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $trend = app(AdminDashboardService::class)->userGrowthTrend();

        return [
            'labels' => $trend['labels'],
            'datasets' => [
                [
                    'label' => 'New users',
                    'data' => $trend['data'],
                    'borderColor' => '#2563eb',
                    'backgroundColor' => 'rgba(37, 99, 235, 0.12)',
                    'tension' => 0.3,
                    'fill' => true,
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
