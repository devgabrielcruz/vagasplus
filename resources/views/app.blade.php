<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0b1f4d">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @php($ads = app(\App\Services\Settings::class)->ads())
    @if ($ads['enabled'] && $ads['client'])
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ $ads['client'] }}" crossorigin="anonymous" onerror="window.__adsBlocked=true"></script>
    @endif
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
    @inertiaHead
</head>
<body class="bg-surface text-ink antialiased">
    @inertia
</body>
</html>
