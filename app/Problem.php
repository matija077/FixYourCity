<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Problem extends Model
{
    
     protected $table = 'problem';

	 protected $primaryKey = 'idproblem';
	 
	 public $timestamps = false;
	 
	 protected $guarded = ['idproblem'];
	 
	 
}