<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
	protected $table = 'vote';
	
	protected $primaryKey = 'idvote';
	
	public $timestamps = false;   // for disabling eloquents' 'created_at' and 'updated_at' table columns
	
	protected $guarded = ['idvote'];
	 
}
