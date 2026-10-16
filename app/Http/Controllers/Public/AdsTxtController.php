<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\Settings;
use Illuminate\Http\Response;

/**
 * /ads.txt gerado a partir do ID do editor configurado no painel (exigido pelo AdSense).
 */
class AdsTxtController extends Controller
{
    public function __invoke(Settings $settings): Response
    {
        $client = $settings->ads()['client'];

        abort_unless($client, 404);

        $publisher = str_replace('ca-pub-', 'pub-', $client);

        return response("google.com, {$publisher}, DIRECT, f08c47fec0942fa0\n", 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
