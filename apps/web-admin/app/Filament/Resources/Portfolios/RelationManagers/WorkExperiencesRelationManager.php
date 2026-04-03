<?php

namespace App\Filament\Resources\Portfolios\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class WorkExperiencesRelationManager extends RelationManager
{
    protected static string $relationship = 'workExperiences';

    protected static ?string $recordTitleAttribute = 'company';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Work Experience')
                    ->schema([
                        TextInput::make('company')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('role')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('location')
                            ->maxLength(255),
                        TextInput::make('url')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('start_date')
                            ->maxLength(50),
                        TextInput::make('end_date')
                            ->maxLength(50),
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
                TextColumn::make('company')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('role')
                    ->searchable(),
                TextColumn::make('start_date')
                    ->label('Start')
                    ->toggleable(),
                TextColumn::make('end_date')
                    ->label('End')
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->headerActions([
                CreateAction::make(),
            ]);
    }
}
