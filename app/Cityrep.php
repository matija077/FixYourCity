<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cityrep extends Model
{
	protected $table = 'cityrep';
	
	protected $primaryKey = 'idcityrep';
	
	public $timestamps = false;
	
	protected $guarded = ['idcityrep'];
	 
	 
}