  const handleSearch = () => {
    const params = new URLSearchParams()
    params.append('from', from)
    params.append('to', to)
    params.append('departureDate', departureDate)
    params.append('returnDate', returnDate)
    params.append('tripType', tripType)
    params.append('adult', String(passengers.adult))
    params.append('child', String(passengers.child))
    params.append('infantWithSeat', String(passengers.infantWithSeat))
    params.append('infantNoSeat', String(passengers.infantNoSeat))
    params.append('senior', String(passengers.senior))
    router.push(`/search?${params.toString()}`)
  }
