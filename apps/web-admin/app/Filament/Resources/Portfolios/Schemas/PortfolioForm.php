<?php

namespace App\Filament\Resources\Portfolios\Schemas;

use App\Models\Project;
use App\Models\User;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PortfolioForm
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
                Section::make('Profile')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('job_title')
                            ->maxLength(255),
                        TextInput::make('location')
                            ->maxLength(255),
                        Textarea::make('introduction')
                            ->rows(3)
                            ->columnSpanFull(),
                        Textarea::make('about')
                            ->rows(5)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Section::make('Contact')
                    ->schema([
                        TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('phone')
                            ->maxLength(50),
                        TextInput::make('website')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('github')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('linkedin')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('twitter')
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
                        TextInput::make('avatar_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        TextInput::make('resume_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
