<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Public as Site;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Área pública
|--------------------------------------------------------------------------
*/
Route::get('/', Site\HomeController::class)->name('home');
Route::get('/vagas', [Site\JobController::class, 'index'])->name('jobs.index');
Route::get('/vagas/{job:slug}', [Site\JobController::class, 'show'])->name('jobs.show');
Route::middleware('throttle:ai-assistant')->group(function () {
    Route::post('/vagas/{job:slug}/entrevista', [Site\AssistantController::class, 'interview'])->name('jobs.interview');
    Route::post('/vagas/{job:slug}/perguntas-provaveis', [Site\AssistantController::class, 'questions'])->name('jobs.questions');
    Route::post('/vagas/{job:slug}/compatibilidade', [Site\AssistantController::class, 'match'])->name('jobs.match');
});
Route::post('/vagas/{job:slug}/entrevista-video', [Site\VideoInterviewController::class, 'start'])->middleware('throttle:ai-assistant')->name('jobs.video.start');
Route::post('/entrevista-video/{conversation}/encerrar', [Site\VideoInterviewController::class, 'end'])->where('conversation', '[A-Za-z0-9]{8,40}')->middleware('throttle:30,1')->name('jobs.video.end');
Route::get('/categorias', [Site\CategoryController::class, 'index'])->name('categories.index');
Route::get('/categorias/{slug}', [Site\CategoryController::class, 'show'])->name('categories.show');
Route::get('/localidades/{slug}', [Site\LocationController::class, 'show'])->name('locations.show');
Route::get('/sobre', [Site\PageController::class, 'about'])->name('about');
Route::get('/privacidade', [Site\PageController::class, 'privacy'])->name('privacy');
Route::get('/termos', [Site\PageController::class, 'terms'])->name('terms');
Route::get('/minhas-vagas', [Site\SavedJobsController::class, 'index'])->name('saved.index');
Route::get('/minhas-vagas/consultar', [Site\SavedJobsController::class, 'check'])->middleware('throttle:60,1')->name('saved.check');
Route::get('/publicar-vaga', [Site\SubmissionController::class, 'create'])->name('submit.create');
Route::post('/publicar-vaga', [Site\SubmissionController::class, 'store'])->middleware('throttle:6,60')->name('submit.store');
Route::get('/publicar-vaga/enviado', [Site\SubmissionController::class, 'done'])->name('submit.done');
Route::get('/sugestoes', Site\SuggestionController::class)->middleware('throttle:90,1')->name('suggestions');
Route::get('/ads.txt', Site\AdsTxtController::class)->name('ads.txt');
Route::get('/sitemap.xml', Site\SitemapController::class)->name('sitemap');
Route::get('/robots.txt', Site\RobotsController::class)->name('robots');

/*
|--------------------------------------------------------------------------
| Painel administrativo (não há cadastro público: admins via `php artisan admin:create`)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [Admin\AuthController::class, 'create'])->name('login');
        Route::post('login', [Admin\AuthController::class, 'store'])->middleware('throttle:20,1')->name('login.store');
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::post('logout', [Admin\AuthController::class, 'destroy'])->name('logout');
        Route::get('/', Admin\DashboardController::class)->name('dashboard');

        Route::get('vagas', [Admin\JobController::class, 'index'])->name('jobs.index');
        Route::post('vagas/importar', Admin\JobImportController::class)->middleware('throttle:20,1')->name('jobs.import');
        Route::get('vagas/criar', [Admin\JobController::class, 'create'])->name('jobs.create');
        Route::post('vagas', [Admin\JobController::class, 'store'])->name('jobs.store');
        Route::get('vagas/{job}/editar', [Admin\JobController::class, 'edit'])->name('jobs.edit');
        Route::put('vagas/{job}', [Admin\JobController::class, 'update'])->name('jobs.update');
        Route::get('vagas/{job}/preview', [Admin\JobController::class, 'preview'])->name('jobs.preview');
        Route::post('vagas/{job}/arquivar', [Admin\JobController::class, 'archive'])->name('jobs.archive');
        Route::post('vagas/{job}/restaurar', [Admin\JobController::class, 'restore'])->name('jobs.restore');
        Route::post('vagas/{job}/renovar', [Admin\JobController::class, 'renew'])->name('jobs.renew');
        Route::post('vagas/{job}/cancelar-agendamento', [Admin\JobController::class, 'unschedule'])->name('jobs.unschedule');

        Route::get('solicitacoes', [Admin\SubmissionController::class, 'index'])->name('submissions.index');
        Route::get('solicitacoes/{submission}', [Admin\SubmissionController::class, 'show'])->name('submissions.show');
        Route::post('solicitacoes/{submission}/aprovar', [Admin\SubmissionController::class, 'approve'])->name('submissions.approve');
        Route::post('solicitacoes/{submission}/recusar', [Admin\SubmissionController::class, 'reject'])->name('submissions.reject');

        Route::get('empresas', [Admin\CompanyController::class, 'index'])->name('companies.index');
        Route::get('empresas/sugestoes', [Admin\CompanyController::class, 'suggest'])->name('companies.suggest');
        Route::post('empresas', [Admin\CompanyController::class, 'store'])->name('companies.store');
        Route::put('empresas/{company}', [Admin\CompanyController::class, 'update'])->name('companies.update');
        Route::delete('empresas/{company}', [Admin\CompanyController::class, 'destroy'])->name('companies.destroy');

        Route::get('plataformas', [Admin\PlatformController::class, 'index'])->name('platforms.index');
        Route::post('plataformas', [Admin\PlatformController::class, 'store'])->name('platforms.store');
        Route::put('plataformas/{platform}', [Admin\PlatformController::class, 'update'])->name('platforms.update');
        Route::delete('plataformas/{platform}', [Admin\PlatformController::class, 'destroy'])->name('platforms.destroy');

        Route::get('categorias', [Admin\CategoryController::class, 'index'])->name('categories.index');
        Route::post('categorias', [Admin\CategoryController::class, 'store'])->name('categories.store');
        Route::put('categorias/{category}', [Admin\CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categorias/{category}', [Admin\CategoryController::class, 'destroy'])->name('categories.destroy');

        Route::get('configuracoes', [Admin\SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('configuracoes', [Admin\SettingsController::class, 'update'])->name('settings.update');
        Route::post('configuracoes/testar-gemini', [Admin\SettingsController::class, 'testGemini'])->middleware('throttle:10,1')->name('settings.test-gemini');
    });
});
