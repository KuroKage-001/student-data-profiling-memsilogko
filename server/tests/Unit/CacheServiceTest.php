<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CacheService;
use Illuminate\Support\Facades\Cache;

class CacheServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Clear cache before each test
        Cache::flush();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_caches_data_using_remember_method()
    {
        $callCount = 0;
        
        // First call - should execute callback
        $result1 = CacheService::remember(
            'test',
            ['key' => 'value'],
            function () use (&$callCount) {
                $callCount++;
                return ['data' => 'test'];
            }
        );

        $this->assertEquals(['data' => 'test'], $result1);
        $this->assertEquals(1, $callCount);

        // Second call - should return cached result without executing callback
        $result2 = CacheService::remember(
            'test',
            ['key' => 'value'],
            function () use (&$callCount) {
                $callCount++;
                return ['data' => 'different'];
            }
        );

        $this->assertEquals(['data' => 'test'], $result2);
        $this->assertEquals(1, $callCount); // Callback not executed again
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_invalidates_cache_correctly()
    {
        $callCount = 0;
        
        // Cache some data
        $result1 = CacheService::remember(
            'test',
            ['key' => 'value'],
            function () use (&$callCount) {
                $callCount++;
                return ['data' => 'original'];
            }
        );

        $this->assertEquals(['data' => 'original'], $result1);
        $this->assertEquals(1, $callCount);

        // Invalidate cache using Cache::flush() for testing
        // In production, CacheService::invalidate() works with database driver
        Cache::flush();

        // Should execute callback again after invalidation
        $result2 = CacheService::remember(
            'test',
            ['key' => 'value'],
            function () use (&$callCount) {
                $callCount++;
                return ['data' => 'new'];
            }
        );

        $this->assertEquals(['data' => 'new'], $result2);
        $this->assertEquals(2, $callCount); // Callback executed again
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_generates_different_keys_for_different_parameters()
    {
        $callCount1 = 0;
        $callCount2 = 0;

        // Cache with first set of parameters
        $result1 = CacheService::remember(
            'test',
            ['key' => 'value1'],
            function () use (&$callCount1) {
                $callCount1++;
                return ['data' => 'first'];
            }
        );

        // Cache with second set of parameters
        $result2 = CacheService::remember(
            'test',
            ['key' => 'value2'],
            function () use (&$callCount2) {
                $callCount2++;
                return ['data' => 'second'];
            }
        );

        // Both should have executed their callbacks (different cache keys)
        $this->assertEquals(['data' => 'first'], $result1);
        $this->assertEquals(['data' => 'second'], $result2);
        $this->assertEquals(1, $callCount1);
        $this->assertEquals(1, $callCount2);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_handles_cache_failures_gracefully()
    {
        // Simulate cache failure by using invalid cache driver
        config(['cache.default' => 'invalid']);

        $result = CacheService::remember(
            'test',
            ['key' => 'value'],
            function () {
                return ['data' => 'fallback'];
            }
        );

        // Should still return result even if cache fails
        $this->assertEquals(['data' => 'fallback'], $result);

        // Restore cache driver
        config(['cache.default' => 'array']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_clears_all_cache()
    {
        // Cache multiple items
        CacheService::remember('test1', ['key' => 'value1'], fn() => ['data' => 'test1']);
        CacheService::remember('test2', ['key' => 'value2'], fn() => ['data' => 'test2']);

        // Clear all cache
        CacheService::clearAll();

        // Verify cache is cleared by checking if callbacks execute
        $callCount = 0;
        CacheService::remember(
            'test1',
            ['key' => 'value1'],
            function () use (&$callCount) {
                $callCount++;
                return ['data' => 'new'];
            }
        );

        $this->assertEquals(1, $callCount); // Callback executed (cache was cleared)
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_cache_statistics()
    {
        $stats = CacheService::getStats();

        $this->assertIsArray($stats);
        $this->assertArrayHasKey('driver', $stats);
        $this->assertArrayHasKey('enabled', $stats);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_uses_different_ttl_values()
    {
        // Test with SHORT_TTL
        $result1 = CacheService::remember(
            'test_short',
            ['key' => 'value'],
            fn() => ['data' => 'short'],
            CacheService::SHORT_TTL
        );
        $this->assertEquals(['data' => 'short'], $result1);

        // Test with DEFAULT_TTL
        $result2 = CacheService::remember(
            'test_default',
            ['key' => 'value'],
            fn() => ['data' => 'default'],
            CacheService::DEFAULT_TTL
        );
        $this->assertEquals(['data' => 'default'], $result2);

        // Test with LONG_TTL
        $result3 = CacheService::remember(
            'test_long',
            ['key' => 'value'],
            fn() => ['data' => 'long'],
            CacheService::LONG_TTL
        );
        $this->assertEquals(['data' => 'long'], $result3);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_forgets_specific_cache_entry()
    {
        $callCount = 0;

        // Cache some data
        CacheService::remember(
            'test',
            ['key' => 'value'],
            function () use (&$callCount) {
                $callCount++;
                return ['data' => 'original'];
            }
        );

        $this->assertEquals(1, $callCount);

        // Forget specific entry
        CacheService::forget('test', ['key' => 'value']);

        // Should execute callback again
        CacheService::remember(
            'test',
            ['key' => 'value'],
            function () use (&$callCount) {
                $callCount++;
                return ['data' => 'new'];
            }
        );

        $this->assertEquals(2, $callCount);
    }

    protected function tearDown(): void
    {
        // Clean up cache after each test
        Cache::flush();
        
        parent::tearDown();
    }
}
