const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const _ = require('underscore');
const { update } = require('../models/usuario');

app.get('/usuario', function(req, res) {


    let desde = req.query.desde || 0;
    desde = Number(desde);


    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })
        });
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuarioDB
        });

    });

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'correo', 'img', 'estado', 'role']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            usuarioDB
        });
    });
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    // Usuario.findOneAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err

    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'usuario no encontrado'
    //             }

    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
    let cambioestado = { estado: false };
    Usuario.findByIdAndUpdate(id, cambioestado, { new: true }, (err, usuariodeleted) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        if (!usuariodeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }

            });
        }
        res.json({
            ok: true,
            usuariodeleted
        });
    });

});


module.exports = app;