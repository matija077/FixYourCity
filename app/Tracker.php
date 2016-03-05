<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tracker extends Model
{
	protected $table = 'tracker';
	
	protected $primaryKey = 'idtrack';
	
	protected $guarded = ['idtrack'];
	
}
