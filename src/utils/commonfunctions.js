function fastIndexOf(a, b) {
  for (var c = 0, d = a.length; c < d; c++)
    if (b === a[c])
      return c;
  return -1		
}