package HerramientasDesarrollo.demo.controller;

import HerramientasDesarrollo.demo.dto.doctor.DoctorListResponse;
import HerramientasDesarrollo.demo.dto.slot.DoctorSlotResponse;
import HerramientasDesarrollo.demo.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctores")
@RequiredArgsConstructor
@Tag(name = "Doctores", description = "Consultas de catálogo de médicos y disponibilidad")
/**
 * Endpoints de consulta para el catálogo médico visible en el flujo de agendamiento.
 */
public class DoctorController {

    private final DoctorService doctorService;

    /**
     * Punto de entrada del buscador de doctores: aplica filtros opcionales y devuelve
     * la información mínima para listar tarjetas en frontend.
     */
    @GetMapping
    @Operation(summary = "Listar doctores", description = "Devuelve doctores con datos visibles en catálogo y próxima disponibilidad")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado obtenido"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
        })
    public ResponseEntity<List<DoctorListResponse>> listDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String especialidad
    ) {
        return ResponseEntity.ok(doctorService.listDoctors(search, especialidad));
    }

    /**
     * Entrega la grilla diaria de disponibilidad de un médico, ordenada por hora,
     * para que el cliente pueda habilitar selección de turno por franja.
     */
    @GetMapping("/{doctorId}/slots")
    @Operation(summary = "Listar slots por doctor y fecha", description = "Retorna los turnos del día ordenados por hora")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Slots obtenidos"),
            @ApiResponse(responseCode = "400", description = "Parametro de fecha invalido"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
        })
    public ResponseEntity<List<DoctorSlotResponse>> getDoctorSlotsByDate(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(doctorService.getDoctorSlotsByDate(doctorId, date));
    }
}
