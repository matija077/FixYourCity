<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
	protected $table = 'comment';
	
	protected $primaryKey = 'idcomment';
	
	public $timestamps = false;   // for disabling eloquents' 'created_at' and 'updated_at' table columns
	
	protected $guarded = ['idcommment'];
	 
}
