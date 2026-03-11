<?php

namespace App\Providers;

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
        if (app()->runningInConsole() && request()->server('argv')[1] ?? null === 'serve') {
            echo "\033[32mLaravel Server Checking: Working\033[0m\n";
        }
    }
}
