<?php

use Illuminate\Support\Facades\Schedule;

// Produção: * * * * * cd /caminho/do/projeto && php artisan schedule:run >> /dev/null 2>&1
Schedule::command('jobs:publish-scheduled')->everyMinute()->withoutOverlapping();
Schedule::command('jobs:expire')->everyFiveMinutes()->withoutOverlapping();
