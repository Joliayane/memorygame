import React, { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const symbols = ["🍎", "🍌", "🍇", "🍒", "🥝", "🍉", "🍍", "🍑"];

export default function HomeScreen() {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [openedCards, setOpenedCards] = useState<number[]>([]);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    let duplicated = [...symbols, ...symbols];

    let shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((item, index) => {
        return {
          id: index,
          value: item,
        };
      });

    setCards(shuffled);
    setSelectedCards([]);
    setMatchedCards([]);
    setDisabled(false);
    setScore(0);
    setOpenedCards([]);
  };

  const handleCardPress = (card: any) => {
    if (disabled) return;

    if (selectedCards.find((item) => item.id === card.id)) return;

    if (
      openedCards.includes(card.id) &&
      !matchedCards.includes(card.value)
    ) {
      setScore((prev) => prev - 1);
    }

    setOpenedCards((prev) => [...prev, card.id]);

    let updated = [...selectedCards, card];
    setSelectedCards(updated);

    if (updated.length === 2) {
      setDisabled(true);

      if (updated[0].value === updated[1].value) {
        setMatchedCards((prev) => [...prev, updated[0].value]);
        setScore((prev) => prev + 20);

        setTimeout(() => {
          setSelectedCards([]);
          setDisabled(false);
        }, 500);
      } else {
        setTimeout(() => {
          setSelectedCards([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedCards.length === symbols.length) {
      Alert.alert("You Win!", "All cards matched!", [
        {
          text: "Play Again",
          onPress: startGame,
        },
      ]);
    }
  }, [matchedCards]);

  const isCardVisible = (card: any) => {
    return (
      selectedCards.find((item) => item.id === card.id) ||
      matchedCards.includes(card.value)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Game</Text>

      <Text style={styles.score}>Score: {score}</Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => handleCardPress(card)}
            disabled={disabled}
          >
            <Text style={styles.cardText}>
              {isCardVisible(card) ? card.value : "?"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={startGame}>
        <Text style={styles.resetText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  score: {
    fontSize: 22,
    marginBottom: 20,
  },

  grid: {
    width: 320,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  card: {
    width: 70,
    height: 70,
    backgroundColor: "#4e73df",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  cardText: {
    fontSize: 28,
    color: "white",
  },

  resetButton: {
    marginTop: 20,
    backgroundColor: "black",
    padding: 12,
    borderRadius: 10,
  },

  resetText: {
    color: "white",
    fontSize: 18,
  },
});