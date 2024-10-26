<?php

namespace App\Providers;

use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        AliasLoader::getInstance()->alias('SEOMeta', \Artesaos\SEOTools\Facades\SEOMeta::class);
        AliasLoader::getInstance()->alias('OpenGraph', \Artesaos\SEOTools\Facades\OpenGraph::class);
        AliasLoader::getInstance()->alias('Twitter', \Artesaos\SEOTools\Facades\TwitterCard::class);
        AliasLoader::getInstance()->alias('JsonLd', \Artesaos\SEOTools\Facades\JsonLd::class);
        AliasLoader::getInstance()->alias('JsonLdMulti', \Artesaos\SEOTools\Facades\JsonLdMulti::class);
    }
}
