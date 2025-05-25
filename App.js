import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  Switch,
} from 'react-native';
import questions from './questions.json';
import logo from './logo.jpeg';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function App() {
  const [index, setIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const currentQuestion = shuffledQuestions[index];

  const theme = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [index, showExplanation, selectedLevel]);

  const handleAnswer = (option) => {
    if (!currentQuestion) return;
    const correct = option === currentQuestion.answer;
    setIsAnswerCorrect(correct);
    if (correct) setScore((prev) => prev + 1);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setIsAnswerCorrect(null);
    if (index + 1 < shuffledQuestions.length) {
      setIndex((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const previousQuestion = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setShowExplanation(false);
      setIsAnswerCorrect(null);
    }
  };

  const goHome = () => {
    setSelectedLevel(null);
    setShuffledQuestions([]);
    setScore(0);
    setIndex(0);
    setShowExplanation(false);
    setIsAnswerCorrect(null);
    setQuizComplete(false);
  };

  const restartQuiz = () => {
    setIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedLevel(null);
    setQuizComplete(false);
    setShuffledQuestions([]);
    setIsAnswerCorrect(null);
  };

  const startLevel = (level) => {
    const filtered = questions.filter((q) => q.level === level);
    const shuffled = shuffleArray(filtered);
    setSelectedLevel(level);
    setShuffledQuestions(shuffled);
    setIndex(0);
    setScore(0);
    setQuizComplete(false);
    setShowExplanation(false);
    setIsAnswerCorrect(null);
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  if (!selectedLevel) {
    return (
      <ScrollView contentContainerStyle={theme.container}>
        <View style={theme.toggleContainer}>
          <Text style={theme.toggleLabel}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <Image source={logo} style={theme.logo} resizeMode="contain" />
        <Text style={theme.appName}>BawahTech PhishShield</Text>
        <Text style={theme.description}>
          BawahTech PhishShield is a powerful, interactive quiz app crafted by
          BawahTechConsulting to help employees across all industries recognize
          and stop phishing attacks.
        </Text>
        <Text style={theme.title}>Select Difficulty Level</Text>

        {[1, 2, 3].map((level) => (
          <TouchableOpacity
            key={level}
            style={theme.levelButton}
            onPress={() => startLevel(level)}
          >
            <Text style={theme.levelButtonText}>Level {level}</Text>
            <Text style={theme.levelButtonSub}>
              {level === 1
                ? 'Basic phishing awareness for all employees'
                : level === 2
                ? 'For regular users and office workers'
                : 'Sophisticated attacks, security pros'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  if (quizComplete) {
    const percent = ((score / shuffledQuestions.length) * 100).toFixed(0);
    return (
      <View style={theme.container}>
        <View style={theme.toggleContainer}>
          <Text style={theme.toggleLabel}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <Text style={theme.title}>Quiz Completed!</Text>
        <Text style={theme.scoreText}>
          Your Score: {score} / {shuffledQuestions.length}
        </Text>
        <Text style={theme.scorePercent}>{percent}%</Text>
        <TouchableOpacity style={theme.restartButton} onPress={restartQuiz}>
          <Text style={theme.restartButtonText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = (index + (showExplanation ? 1 : 0)) / shuffledQuestions.length;

  return (
    <ScrollView contentContainerStyle={theme.container}>
      <View style={theme.toggleContainer}>
        <Text style={theme.toggleLabel}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <Text style={theme.level}>Level {currentQuestion.level}</Text>
      <Text style={theme.progress}>
        Question {index + 1} / {shuffledQuestions.length}
      </Text>

      <View style={theme.progressBarContainer}>
        <Animated.View style={[theme.progressBarFill, { flex: progress }]} />
        <View style={{ flex: 1 - progress }} />
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {!showExplanation ? (
          <>
            <Text style={theme.question}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={theme.optionButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={theme.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={theme.explanationContainer}>
            <Text style={theme.explanationTitle}>
              {isAnswerCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </Text>
            <Text style={theme.explanation}>{currentQuestion.explanation}</Text>

            <View style={theme.buttonRow}>
              <TouchableOpacity
                style={[
                  theme.navButton,
                  index === 0 && theme.navButtonDisabled,
                ]}
                onPress={previousQuestion}
                disabled={index === 0}
              >
                <Text style={theme.navButtonText}>⬅️ Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity style={theme.navButton} onPress={goHome}>
                <Text style={theme.navButtonText}>🏠 Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={theme.navButton} onPress={nextQuestion}>
                <Text style={theme.navButtonText}>Next ➡️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const baseStyles = {
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  toggleLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  progressBarContainer: {
    height: 12,
    flexDirection: 'row',
    backgroundColor: '#d1d9e6',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    padding: 25,
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#004aad',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 20,
  },
  levelButton: {
    backgroundColor: '#004aad',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  levelButtonText: { fontSize: 20, color: '#fff', fontWeight: '600' },
  levelButtonSub: { fontSize: 14, color: '#dbe6ff', marginTop: 6 },
  level: { fontSize: 22, fontWeight: '700', color: '#004aad' },
  progress: { fontSize: 16, color: '#666', marginBottom: 12 },
  progressBarFill: { backgroundColor: '#004aad' },
  question: { fontSize: 20, color: '#222', fontWeight: '600', marginBottom: 20 },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#004aad',
    borderWidth: 1,
  },
  optionText: { color: '#004aad', fontSize: 16, fontWeight: '500' },
  explanationContainer: {
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    padding: 20,
    marginTop: 25,
  },
  explanationTitle: { fontSize: 18, fontWeight: '700', color: '#003366' },
  explanation: { fontSize: 16, fontStyle: 'italic', color: '#003366' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  navButton: {
    backgroundColor: '#004aad',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  navButtonDisabled: { backgroundColor: '#ccc' },
  navButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  scoreText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#004aad',
  },
  scorePercent: {
    fontSize: 48,
    fontWeight: '900',
    color: '#007acc',
    textAlign: 'center',
    marginBottom: 40,
  },
  restartButton: {
    backgroundColor: '#007acc',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

const darkStyles = StyleSheet.create({
  ...lightStyles,
  container: { ...lightStyles.container, backgroundColor: '#121212' },
  appName: { ...lightStyles.appName, color: '#61dafb' },
  description: { ...lightStyles.description, color: '#ccc' },
  title: { ...lightStyles.title, color: '#fff' },
  levelButton: { ...lightStyles.levelButton, backgroundColor: '#1f1f1f' },
  levelButtonText: { ...lightStyles.levelButtonText, color: '#fff' },
  levelButtonSub: { ...lightStyles.levelButtonSub, color: '#aaa' },
  level: { ...lightStyles.level, color: '#61dafb' },
  progress: { ...lightStyles.progress, color: '#999' },
  question: { ...lightStyles.question, color: '#fff' },
  optionButton: {
    ...lightStyles.optionButton,
    backgroundColor: '#1e1e1e',
    borderColor: '#61dafb',
  },
  optionText: { ...lightStyles.optionText, color: '#61dafb' },
  explanationContainer: {
    ...lightStyles.explanationContainer,
    backgroundColor: '#1a2b44',
  },
  explanationTitle: { ...lightStyles.explanationTitle, color: '#61dafb' },
  explanation: { ...lightStyles.explanation, color: '#ccc' },
  navButton: { ...lightStyles.navButton, backgroundColor: '#333' },
  navButtonDisabled: { backgroundColor: '#555' },
  navButtonText: { ...lightStyles.navButtonText, color: '#fff' },
  scoreText: { ...lightStyles.scoreText, color: '#61dafb' },
  scorePercent: { ...lightStyles.scorePercent, color: '#00bfff' },
  restartButton: { ...lightStyles.restartButton, backgroundColor: '#444' },
  restartButtonText: { ...lightStyles.restartButtonText, color: '#fff' },
});
