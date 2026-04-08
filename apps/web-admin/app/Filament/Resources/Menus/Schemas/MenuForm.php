<?php

namespace App\Filament\Resources\Menus\Schemas;

use App\Models\Project;
use App\Models\User;
use App\Support\FormUrlPreviewAction;
use App\Support\HostedSiteUrl;
use Filament\Actions\Action;
use Filament\Forms\Components\CodeEditor;
use Filament\Forms\Components\CodeEditor\Enums\Language;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MenuForm
{
    protected static function resolveHostedSiteUrl(mixed $record, mixed $projectId): ?string
    {
        $resolvedProjectId = $projectId ?: $record?->project_id;

        if (! $resolvedProjectId) {
            return null;
        }

        $subdomain = Project::query()
            ->whereKey($resolvedProjectId)
            ->value('sub_domain');

        return HostedSiteUrl::fromSubdomain($subdomain);
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Menu details')
                    ->columnSpanFull()
                    ->schema([
                        Select::make('user_id')
                            ->label('Owner')
                            ->relationship('user', 'email')
                            ->getOptionLabelFromRecordUsing(fn (User $record): string => "{$record->full_name} ({$record->email})")
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('project_id')
                            ->label('Project')
                            ->relationship('project', 'name')
                            ->getOptionLabelFromRecordUsing(fn (Project $record): string => "{$record->name} ({$record->type})")
                            ->searchable()
                            ->preload()
                            ->required(),
                        Placeholder::make('hosted_site_url')
                            ->label('Hosted site')
                            ->content(fn ($record, $get): string => static::resolveHostedSiteUrl($record, $get('project_id')) ?? 'Select a project with a subdomain to generate the live URL.')
                            ->hintAction(
                                Action::make('visitSite')
                                    ->label('Visit site')
                                    ->icon('heroicon-o-arrow-top-right-on-square')
                                    ->url(
                                        fn ($record, $get): ?string => static::resolveHostedSiteUrl($record, $get('project_id')),
                                        shouldOpenInNewTab: true,
                                    )
                                    ->visible(fn ($record, $get): bool => filled(static::resolveHostedSiteUrl($record, $get('project_id'))))
                            )
                            ->columnSpanFull(),
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                        TextInput::make('phone')
                            ->maxLength(50),
                        TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('website_url')
                            ->url()
                            ->maxLength(255)
                            ->suffixAction(FormUrlPreviewAction::make('previewWebsiteUrl')),
                        TextInput::make('address')
                            ->maxLength(255),
                        TextInput::make('city')
                            ->maxLength(255),
                        TextInput::make('google_maps_url')
                            ->url()
                            ->maxLength(255)
                            ->suffixAction(FormUrlPreviewAction::make('previewGoogleMaps')),
                        TextInput::make('layout_name')
                            ->label('Layout')
                            ->maxLength(100),
                        TextInput::make('theme_name')
                            ->label('Theme')
                            ->maxLength(100),
                        TextInput::make('logo_url')
                            ->url()
                            ->maxLength(255)
                            ->suffixAction(FormUrlPreviewAction::make('previewLogo'))
                            ->columnSpanFull(),
                        TextInput::make('cover_image_url')
                            ->url()
                            ->maxLength(255)
                            ->suffixAction(FormUrlPreviewAction::make('previewCoverImage'))
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->compact(),
                Section::make('Theme')
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        CodeEditor::make('theme_object')
                            ->label('Theme')
                            ->language(Language::Json)
                            ->formatStateUsing(fn ($state): string => json_encode($state ?? new \stdClass(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) ?: '{}')
                            ->dehydrateStateUsing(function ($state): array {
                                if (blank($state)) {
                                    return [];
                                }

                                $decoded = json_decode($state, true);

                                return is_array($decoded) ? $decoded : [];
                            })
                            ->helperText('Edit the full theme JSON here, including nested styles.')
                            ->columnSpanFull(),
                    ])
                    ->compact(),
                Section::make('Behavior')
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        Toggle::make('search_enabled'),
                        Toggle::make('hours_enabled'),
                        KeyValue::make('qr_settings')
                            ->keyLabel('Key')
                            ->valueLabel('Value')
                            ->columnSpanFull(),
                        KeyValue::make('business_hours')
                            ->keyLabel('Day')
                            ->valueLabel('Hours')
                            ->columnSpanFull(),
                        KeyValue::make('social_links')
                            ->keyLabel('Network')
                            ->valueLabel('URL')
                            ->columnSpanFull(),
                        KeyValue::make('gallery_images')
                            ->keyLabel('Order')
                            ->valueLabel('URL')
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->compact(),
            ]);
    }
}
