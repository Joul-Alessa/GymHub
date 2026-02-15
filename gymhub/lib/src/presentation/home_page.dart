import 'package:flutter/material.dart';
import '../data/local_file_service.dart';
import 'add_exercise_page.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final LocalFileService fileService = LocalFileService();
  String jsonContent = '';

  @override
  void initState() {
    super.initState();
    initFile();
  }

  Future<void> initFile() async {
    await fileService.ensureExercisesFileExists();
  }

  Future<void> loadJson() async {
    final data = await fileService.readExercises();
    setState(() {
      jsonContent = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('GymHub – Catálogo editable')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: loadJson,
              child: Text('Leer exercises.json'),
            ),
            SizedBox(height: 20),
            Expanded(
              child: SingleChildScrollView(
                child: Text(jsonContent),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => AddExercisePage()),
          );
        },
        child: Icon(Icons.add),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}