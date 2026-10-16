<?php

namespace App\Services;

use RuntimeException;

/** A IA não pôde atender agora. A mensagem é segura para mostrar ao visitante; o código 429 indica cota esgotada. */
class AssistantUnavailableException extends RuntimeException {}
