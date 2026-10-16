<?php

namespace App\Enums;

enum JobEvent: string
{
    case Created = 'created';
    case Updated = 'updated';
    case Published = 'published';
    case Scheduled = 'scheduled';
    case Renewed = 'renewed';
    case Expired = 'expired';
    case Archived = 'archived';
    case Restored = 'restored';
}
