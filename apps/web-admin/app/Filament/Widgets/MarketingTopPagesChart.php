<?php

namespace App\Filament\Widgets;

use App\Support\MarketingDashboardClient;
class MarketingTopPagesChart extends BaseChartWidget
{
    protected static ?int $sort = 80;

    protected ?string $heading = 'Top marketing pages';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '320px';

    protected function getData(): array
    {
        $overview = app(MarketingDashboardClient::class)->overview();
        $pages = $overview['top_pages'] ?? [];

        return [
            'labels' => array_map(fn ($page) => (string) ($page['label'] ?? '/'), $pages),
            'datasets' => [
                [
                    'label' => 'Views',
                    'data' => array_map(fn ($page) => (int) ($page['views'] ?? 0), $pages),
                    'backgroundColor' => '#111827',
                ],
                [
                    'label' => 'Clicks',
                    'data' => array_map(fn ($page) => (int) ($page['clicks'] ?? 0), $pages),
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
