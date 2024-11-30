const formations = [
    {
        formation: "4-4-2",
        forward: 2,
        midfield: 4,
        defense: 4,
        goalkeeper: 1,
        prototype: {
          forward: [
            { pos: "st", x: 35, y: 15 },
            { pos: "st", x: 65, y: 15 },
          ],
          midfield: [
            { pos: "cm", x: 22, y: 40 },
            { pos: "cm", x: 35, y: 50 },
            { pos: "cm", x: 65, y: 50 },
            { pos: "cm", x: 78, y: 40 },
          ],
          defense: [
            { pos: "cb", x: 22, y: 80 },
            { pos: "cb", x: 40, y: 85 },
            { pos: "cb", x: 60, y: 85 },
            { pos: "cb", x: 77, y: 80 },
          ],
          goalkeeper: [{ pos: "gk", x: 50, y: 115 }],
        },
      },
    {
      formation: "4-3-3",
      forward: 3,
      midfield: 3,
      defense: 4,
      goalkeeper: 1,
      prototype: {
        forward: [
          { pos: "st", x: 23, y: 15 },
          { pos: "st", x: 50, y: 15 },
          { pos: "st", x: 77, y: 15 },
        ],
        midfield: [
          { pos: "cm", x: 30, y: 55 },
          { pos: "cm", x: 50, y: 40 },
          { pos: "cm", x: 70, y: 55 },
        ],
        defense: [
          { pos: "cb", x: 23, y: 95 },
          { pos: "cb", x: 40, y: 95 },
          { pos: "cb", x: 60, y: 95 },
          { pos: "cb", x: 77, y: 95 },
        ],
        goalkeeper: [{ pos: "gk", x: 50, y: 115 }],
      },
    },
  ];
  
  function repositionCards(formation) {
    console.log(formation);
    const choosedFormation =formations.find(f=>f.formation===formation);
    console.log(choosedFormation);
    
    
    const cards = document.querySelectorAll(".cart");
    let cardIndex = 0;
    for (let i = 0; i < choosedFormation.forward; i++) {
      const card = cards[cardIndex];
      card.style.left = choosedFormation.prototype.forward[i].x + "%";
      card.style.top = choosedFormation.prototype.forward[i].y + "%";
      cardIndex++;
    }
    for (let i = 0; i < choosedFormation.midfield; i++) {
      const card = cards[cardIndex++];
      card.style.left = choosedFormation.prototype.midfield[i].x + "%";
      card.style.top = choosedFormation.prototype.midfield[i].y + "%";
    }
    for (let i = 0; i < choosedFormation.defense; i++) {
      const card = cards[cardIndex++];
      card.style.left = choosedFormation.prototype.defense[i].x + "%";
      card.style.top = choosedFormation.prototype.defense[i].y + "%";
    }
    for (let i = 0; i < choosedFormation.goalkeeper; i++) {
      const card = cards[cardIndex++];
      card.style.left = choosedFormation.prototype.goalkeeper[i].x + "%";
      card.style.top = choosedFormation.prototype.goalkeeper[i].y + "%";
    }
  }
  const formationSelect = document.getElementById("formation_select");
  formationSelect.addEventListener('change', function() {
    repositionCards(formationSelect.value);
  });
  repositionCards(formationSelect.value);
  