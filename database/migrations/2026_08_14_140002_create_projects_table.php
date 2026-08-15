<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('folder_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('note')->nullable();
            $table->string('type')->default('parallel');   // sequential | parallel | single_actions
            $table->string('status')->default('active');   // active | on_hold | done | dropped
            $table->date('defer_date')->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('flagged')->default(false);
            $table->integer('review_interval_days')->nullable();
            $table->timestamp('last_reviewed_at')->nullable();
            $table->timestamp('next_review_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
