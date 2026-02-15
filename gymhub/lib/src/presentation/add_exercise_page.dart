import 'package:flutter/material.dart';
import '../data/local_file_service.dart';
import 'dart:convert';

class AddExercisePage extends StatefulWidget {
  @override
  State<AddExercisePage> createState() => _AddExercisePageState();
}

class _AddExercisePageState extends State<AddExercisePage> {
  final TextEditingController _controller = TextEditingController();
  final LocalFileService fileService = LocalFileService();

  Future<void> saveExercise() async {
    final name = _controller.text.trim();
    if (name.isEmpty) return;

    // Leer archivo actual
    final content = await fileService.readExercises();
    final data = jsonDecode(content);

    // Crear nuevo objeto
    final newExercise = {
      "name": name
    };

    // Insertarlo al array
    data["exercises"].add(newExercise);

    // Guardar archivo
    await fileService.writeExercises(jsonEncode(data));

    // Regresar a la pantalla anterior
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Nuevo ejercicio"),
        actions: [
          IconButton(
            icon: Icon(Icons.check),
            onPressed: saveExercise,
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: TextField(
          controller: _controller,
          decoration: InputDecoration(
            labelText: "Nombre del ejercicio",
            border: OutlineInputBorder(),
          ),
        ),
      ),
    );
  }
}