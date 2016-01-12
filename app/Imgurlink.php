<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Imgurlink extends Model
{
	protected $table = 'imgurlink';
	
	protected $primaryKey = 'url';
	
	protected $fillable = ['url','deletehash'];
	 
	 
}