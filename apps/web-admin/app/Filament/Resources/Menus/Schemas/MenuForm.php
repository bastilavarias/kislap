<?php

namespace App\Filament\Resources\Menus\Schemas;

use App\Models\Project;
use App\Models\User;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MenuForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Owner')
                    ->schema([
                        Select::make('user_id')
                            ->label('User')
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
                    ])
                    ->columns(2),
                Section::make('Basics')
                    ->schema([
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
                            ->maxLength(255),
                        TextInput::make('address')
                            ->maxLength(255),
                        TextInput::make('city')
                            ->maxLength(255),
                        TextInput::make('google_maps_url')
                            ->url()
                            ->maxLength(255),
                    ])
                    ->columns(2),
                Section::make('Appearance')
                    ->schema([
                        TextInput::make('layout_name')
                            ->maxLength(100),
                        TextInput::make('theme_name')
                            ->maxLength(100),
                        KeyValue::make('theme_object')
                            ->keyLabel('Token')
                            ->valueLabel('Value')
                            ->columnSpanFull(),
                        TextInput::make('logo_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        TextInput::make('cover_image_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Section::make('Behavior')
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
                    ->columns(2),
            ]);
    }
}
