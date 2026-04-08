<?php

namespace App\Filament\Widgets;

use App\Support\MarketingDashboardClient;
class MarketingSourceChart extends BaseChartWidget
{
    protected static ?int $sort = 90;

    protected ?string $heading = 'Traffic sources';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $overview = app(MarketingDashboardClient::class)->overview();
        $sources = $overview['source_breakdown'] ?? [];

        return [
            'labels' => array_map(fn ($item) => (string) ($item['label'] ?? 'Unknown'), $sources),
            'datasets' => [
                [
                    'label' => 'Sessions',
                    'data' => array_map(fn ($item) => (int) ($item['total'] ?? 0), $sources),
                    'backgroundColor' => [
                        '#111827',
                        '#2563eb',
                        '#f59e0b',
                        '#22c55e',
                        '#a855f7',
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
