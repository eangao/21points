package com.appsdeveloper.web.rest;

import com.appsdeveloper.domain.Points;
import com.appsdeveloper.repository.PointsRepository;
import com.appsdeveloper.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.appsdeveloper.domain.Points}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PointsResource {

    private final Logger log = LoggerFactory.getLogger(PointsResource.class);

    private static final String ENTITY_NAME = "points";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PointsRepository pointsRepository;

    public PointsResource(PointsRepository pointsRepository) {
        this.pointsRepository = pointsRepository;
    }

    /**
     * {@code POST  /points} : Create a new points.
     *
     * @param points the points to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new points, or with status {@code 400 (Bad Request)} if the points has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/points")
    public ResponseEntity<Points> createPoints(@Valid @RequestBody Points points) throws URISyntaxException {
        log.debug("REST request to save Points : {}", points);
        if (points.getId() != null) {
            throw new BadRequestAlertException("A new points cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Points result = pointsRepository.save(points);
        return ResponseEntity
            .created(new URI("/api/points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /points/:id} : Updates an existing points.
     *
     * @param id the id of the points to save.
     * @param points the points to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated points,
     * or with status {@code 400 (Bad Request)} if the points is not valid,
     * or with status {@code 500 (Internal Server Error)} if the points couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/points/{id}")
    public ResponseEntity<Points> updatePoints(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Points points
    ) throws URISyntaxException {
        log.debug("REST request to update Points : {}, {}", id, points);
        if (points.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, points.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pointsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Points result = pointsRepository.save(points);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, points.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /points/:id} : Partial updates given fields of an existing points, field will ignore if it is null
     *
     * @param id the id of the points to save.
     * @param points the points to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated points,
     * or with status {@code 400 (Bad Request)} if the points is not valid,
     * or with status {@code 404 (Not Found)} if the points is not found,
     * or with status {@code 500 (Internal Server Error)} if the points couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/points/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Points> partialUpdatePoints(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Points points
    ) throws URISyntaxException {
        log.debug("REST request to partial update Points partially : {}, {}", id, points);
        if (points.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, points.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pointsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Points> result = pointsRepository
            .findById(points.getId())
            .map(
                existingPoints -> {
                    if (points.getDate() != null) {
                        existingPoints.setDate(points.getDate());
                    }
                    if (points.getExercise() != null) {
                        existingPoints.setExercise(points.getExercise());
                    }
                    if (points.getMeals() != null) {
                        existingPoints.setMeals(points.getMeals());
                    }
                    if (points.getAlcohol() != null) {
                        existingPoints.setAlcohol(points.getAlcohol());
                    }
                    if (points.getNotes() != null) {
                        existingPoints.setNotes(points.getNotes());
                    }

                    return existingPoints;
                }
            )
            .map(pointsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, points.getId().toString())
        );
    }

    /**
     * {@code GET  /points} : get all the points.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of points in body.
     */
    @GetMapping("/points")
    public List<Points> getAllPoints() {
        log.debug("REST request to get all Points");
        return pointsRepository.findAll();
    }

    /**
     * {@code GET  /points/:id} : get the "id" points.
     *
     * @param id the id of the points to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the points, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/points/{id}")
    public ResponseEntity<Points> getPoints(@PathVariable Long id) {
        log.debug("REST request to get Points : {}", id);
        Optional<Points> points = pointsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(points);
    }

    /**
     * {@code DELETE  /points/:id} : delete the "id" points.
     *
     * @param id the id of the points to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/points/{id}")
    public ResponseEntity<Void> deletePoints(@PathVariable Long id) {
        log.debug("REST request to delete Points : {}", id);
        pointsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
