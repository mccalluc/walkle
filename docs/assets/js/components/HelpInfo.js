export default {
  template: `
    <div>
      <p>Walkle is like Wordle, but for walks.</p>

      <ul>
        <li>Instead of picking a word, it picks a goal location in your neighborhood every day.</li>
        <li>Instead of guessing the letters, you try to walk there.</li>
        <li>Instead of telling you which letters are right, it tells you how much further and in what direction.</li>
      </ul>

      <p>
        The goal location is based on the date,
        so anyone in your area will get the same goal on the same day (if you've selected the same grid size).
        It's a bit like geocaching.
        If travel in your area is constrained in certain directions
        (oceans, highways, dragons, ...), you can pick a goal farther
        north/east/south/west.
      </p> 
    </div>
  `
}
