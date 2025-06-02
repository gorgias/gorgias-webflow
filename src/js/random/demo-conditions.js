// Demo
visibility(
  (
    $f['demo_ecommerce_platform'] !== 'Other'
    && $f['demo_annual_sales_range'] !== '<150000'
    && $f['demo_annual_sales_range'] !== '15000-3000000'
    && $f['demo_annual_sales_range'] !== 'unknown'
  )
  ||
  (
    $f['demo_ecommerce_platform'] !== 'Other'
    && (
      $f['demo_annual_sales_range'] === '<150000'
      || $f['demo_annual_sales_range'] === '15000-3000000'
    )
    && !(
      $f['demo_tickets_volume'] === '< 50'
      || $f['demo_tickets_volume'] === '51 - 300'
      || $f['demo_tickets_volume'] === 'I don\'t know'
    )
  )
  ||
  (
    $f['demo_ecommerce_platform'] !== 'Other'
    && $f['demo_annual_sales_range'] === 'unknown'
    && $f['demo_tickets_volume'] === 'I don\'t know'
  )
)

// Self-serve
visibility(
  (
    $f['demo_ecommerce_platform'] !== 'Other'
    && (
      $f['demo_annual_sales_range'] === '<150000'
      || $f['demo_annual_sales_range'] === '15000-3000000'
    )
    && (
      $f['demo_tickets_volume'] === '< 50'
      || $f['demo_tickets_volume'] === '51 - 300'
    )
  )
  ||
  (
    $f['demo_ecommerce_platform'] === 'Other'
    && $f['demo_annual_sales_range'] !== '<150000'
    && $f['demo_annual_sales_range'] !== '15000-3000000'
    && $f['demo_annual_sales_range'] !== 'unknown'
    && !(
      $f['demo_tickets_volume'] === '< 50'
      || $f['demo_tickets_volume'] === '51 - 300'
      || $f['demo_tickets_volume'] === 'I don\'t know'
    )
  )
  ||
  (
    $f['demo_ecommerce_platform'] === 'Other'
    && $f['demo_annual_sales_range'] === 'unknown'
    && $f['demo_tickets_volume'] === 'I don\'t know'
  )
)

// Unqualified
visibility(
  (
    $f['demo_ecommerce_platform'] === 'Other'
    && (
      $f['demo_annual_sales_range'] === '<150000'
      || $f['demo_annual_sales_range'] === '15000-3000000'
    )
  )
  ||
  (
    $f['demo_ecommerce_platform'] === 'Other'
    && $f['demo_annual_sales_range'] !== '<150000'
    && $f['demo_annual_sales_range'] !== '15000-3000000'
    && (
      $f['demo_tickets_volume'] === '< 50'
      || $f['demo_tickets_volume'] === '51 - 300'
    )
  )
  ||
  (
    $f['demo_ecommerce_platform'] === 'Other'
    && (
      ($f['demo_annual_sales_range'] === 'unknown' && $f['demo_tickets_volume'] !== 'I don\'t know')
      || ($f['demo_annual_sales_range'] !== 'unknown' && $f['demo_tickets_volume'] === 'I don\'t know')
    )
  )
)