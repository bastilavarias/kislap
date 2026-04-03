<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class PortfolioRelationManager extends RelationManager
{
    protected static string $relationship = 'portfolio';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Portfolio')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('job_title')
                            ->maxLength(255),
                        TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('phone')
                            ->maxLength(50),
                        TextInput::make('website')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('layout_name')
                            ->maxLength(100),
                        TextInput::make('theme_name')
                            ->maxLength(100),
                        TextInput::make('avatar_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        TextInput::make('resume_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Textarea::make('introduction')
                            ->rows(3)
                            ->columnSpanFull(),
                        Textarea::make('about')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('job_title')
                    ->label('Title')
                    ->toggleable(),
                TextColumn::make('email')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('layout_name')
                    ->label('Layout')
                    ->toggleable(),
                TextColumn::make('theme_name')
                    ->label('Theme')
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
