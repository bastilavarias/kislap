<?php

namespace App\Filament\Widgets;

use App\Support\AdminDashboardService;
class AdminActivityChart extends BaseChartWidget
{
    protected static ?int $sort = 900;

    protected ?string $heading = 'Admin activity in the last 14 days';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $trend = app(AdminDashboardService::class)->adminActivityTrend();

        return [
            'labels' => $trend['labels'],
            'datasets' => [
                [
                    'label' => 'Admin events',
                    'data' => $trend['data'],
                    'borderColor' => '#ef4444',
                    'backgroundColor' => 'rgba(239, 68, 68, 0.12)',
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
