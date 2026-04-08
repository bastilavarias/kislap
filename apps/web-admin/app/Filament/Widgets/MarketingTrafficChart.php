<?php

namespace App\Filament\Widgets;

use App\Support\MarketingDashboardClient;
class MarketingTrafficChart extends BaseChartWidget
{
    protected static ?int $sort = 70;

    protected ?string $heading = 'Marketing traffic trend';

    protected int|string|array $columnSpan = 2;

    protected ?string $maxHeight = '320px';

    protected function getData(): array
    {
        $overview = app(MarketingDashboardClient::class)->overview();
        $trend = $overview['trend'] ?? [];

        return [
            'labels' => $trend['labels'] ?? [],
            'datasets' => [
                [
                    'label' => 'Sessions',
                    'data' => $trend['sessions'] ?? [],
                    'borderColor' => '#111827',
                    'backgroundColor' => 'rgba(17, 24, 39, 0.08)',
                    'tension' => 0.3,
                ],
                [
                    'label' => 'Page views',
                    'data' => $trend['page_views'] ?? [],
                    'borderColor' => '#2563eb',
                    'backgroundColor' => 'rgba(37, 99, 235, 0.12)',
                    'tension' => 0.3,
                ],
                [
                    'label' => 'Clicks',
                    'data' => $trend['clicks'] ?? [],
                    'borderColor' => '#f59e0b',
                    'backgroundColor' => 'rgba(245, 158, 11, 0.12)',
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
