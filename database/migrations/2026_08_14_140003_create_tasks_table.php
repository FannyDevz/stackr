<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('tasks')->cascadeOnDelete();
            $table->string('title');
            $table->text('note')->nullable();
            $table->string('status')->default('todo'); // todo | done | dropped
            $table->timestamp('completed_at')->nullable();
            $table->date('defer_date')->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('flagged')->default(false);
            $table->integer('estimated_minutes')->nullable();
            $table->json('repeat_rule')->nullable();
            $table->integer('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
